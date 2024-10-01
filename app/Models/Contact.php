<?php

namespace App\Models;

use App\Models\ContactStaff;
use App\Models\Organization;
use App\Models\StudentLevel;
use App\Models\StudentEntryPayment;
use App\Models\StudentMonthlyPayment;
use App\Models\StudentEntryReceivable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Contact extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'phone', 'address', 'description', 'organization_id', 'is_active'];

    public function contactCategories(): BelongsToMany
    {
        return $this->belongsToMany(ContactCategory::class, 'contact_contact_category', 'contact_id', 'contact_category_id');
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function student(): HasOne
    {
        return $this->hasOne(ContactStudent::class);
    }

    public function staff(): HasOne
    {
        return $this->hasOne(ContactStaff::class);
    }

    public function levels(): HasMany
    {
        return $this->hasMany(StudentLevel::class);
    }

    public function lastLevel(): HasOne
    {
        return $this->hasOne(StudentLevel::class)->latestOfMany();
    }

    public function studentEntryReceivable(): HasOne
    {
        return $this->hasOne(StudentEntryReceivable::class);
    }

    public function studentEntryPayment(): HasMany
    {
        return $this->hasMany(StudentEntryPayment::class);
    }

    public function studentMonthlyPayment(): HasMany
    {
        return $this->hasMany(StudentMonthlyPayment::class);
    }

    public function scopeFilter($query, $filters)
    {
        $query->when($filters['search'] ?? false, function ($query, $search) {
            return $query->where('name', 'like', '%'.$search.'%')
                ->orWhere('address', 'like', '%'.$search.'%')
                ->orWhereHas('contactCategories', function ($query) use ($search) {
                    $query->where('name', 'like', '%'.$search.'%');
                });
        });

        $query->when($filters['contact'] ?? false, function ($query, $contact) {
            return $query->where('name', 'like', '%'.$contact.'%')
                            ->orWhereHas('student', function ($query) use ($contact){
                                $query->where('no_ref', 'like', '%'.$contact.'%');
                            });
        });
    }
}
