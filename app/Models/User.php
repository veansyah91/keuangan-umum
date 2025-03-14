<?php

namespace App\Models;

use URL;
use App\Jobs\SendEmailJob;
use App\Models\Affiliation;
use Laravel\Sanctum\HasApiTokens;
use App\Jobs\QueuedVerifyEmailJob;
use App\Jobs\QueuedPasswordResetJob;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Redis;
use App\Notifications\VerifyEmailQueued;
use Illuminate\Notifications\Notifiable;
use App\Notifications\ResetPasswordQueued;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Repositories\MailBroadcast\MailBroadcastRepository;

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

    public function sendEmailVerificationNotification()
    {
        // $this->notify(new VerifyEmailQueued);
        $verificationUrl = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            ['id' => $this->getKey(), 'hash' => sha1($this->getEmailForVerification())]
        );
        $data = [
            'user' => $this,
            'content' => [
                'subject' => "Verifikasi Alamat Email Anda",
                'main_message' => "Silakan klik tautan di bawah untuk verifikasi alamat email anda.",
                'footer_message' => Lang::get('<p>Abaikan email ini jika anda tidak melakukan registrasi pada keuanganumum.com.'),
                'action_url' => $verificationUrl,
                'action_text' => 'Verifikasi Email',
            ]            
        ];
        SendEmailJob::dispatch($data);
    }

    public function sendPasswordResetNotification($token)
    {        
        $data = [
            'user' => $this,
            'content' => [
                'subject' => "Notifikasi Reset Password",
                'main_message' => "Anda menerima email ini karena keuanganumum.com menerima permintaan Reset Password pada akun anda.",
                'footer_message' => Lang::get('<p>Link ini akan kadaluarsa dalam 60 menit.</p>
                <p>Abaikan email ini jika anda tidak melakukan permintaan Reset Password.</p>', ['count' => config('auth.passwords.'.config('auth.defaults.passwords').'.expire')]),
                'action_url' => env('APP_URL') . "/reset-password/" . $token . "?email=" . $this->email,
                'action_text' => 'Reset Password',
            ]            
        ];

        SendEmailJob::dispatch($data);
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
