<?php

namespace App\Models;

use App\Models\Affiliation;
use Laravel\Sanctum\HasApiTokens;
use App\Jobs\QueuedVerifyEmailJob;
use App\Jobs\QueuedPasswordResetJob;
use App\Notifications\VerifyEmailQueued;
use Illuminate\Notifications\Notifiable;
use App\Notifications\ResetPasswordQueued;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */

    //Overrideen sendEmailVerificationNotification implementation

    // public function sendEmailVerificationNotification()
    // {
    //     //dispactches the job to the queue passing it this User object
    //      QueuedVerifyEmailJob::dispatch($this);
    // }

    public function sendEmailVerificationNotification()
    {
        $this->notify(new VerifyEmailQueued);
    }

    // public function sendEmailResetPasswordNotification($token)
    // {
    //     $this->notify(new ResetPasswordQueued($token));
    // }

    public function sendPasswordResetNotification($token)
    {
        //dispactches the job to the queue passing it this User object
        QueuedPasswordResetJob::dispatch($this, $token);
    }

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function organizations(): BelongsToMany
    {
        return $this->belongsToMany(Organization::class)->withPivot('role', 'is_waiting');
    }

    public function affiliation(): HasOne
    {
        return $this->hasOne(Affiliation::class);
    }

    public function journals(): HasMany
    {
        return $this->hasMany(Journal::class);
    }

    public function scopeFilter($query, $filters)
    {
        $query->when($filters['search'] ?? false, function ($query, $search) {
            return $query->where('name', 'like', '%'.$search.'%')
                ->orWhere('email', 'like', '%'.$search.'%');
        });

        $query->when($filters['user'] ?? false, function ($query, $search) {
            return $query->where('email', $search);
        });

        $query->when($filters['start_date'] ?? false, function ($query, $start_date) {
            return $query->where('created_at', '>=', $start_date);
        });

        $query->when($filters['end_date'] ?? false, function ($query, $end_date) {
            return $query->where('created_at', '<=', $end_date);
        });
    }
}
