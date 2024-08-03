<?php

namespace App\Models;

use App\Models\Contact;
use App\Models\StudentPaymentCategory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StudentMonthlyPayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'contact_id',
        'no_ref',
        'value',
        'type',
        'date',
        'month',
        'study_year'
    ];

    public function scopeFilter($query, $filters)
    {
        $query->when($filters['search'] ?? false, function ($query, $search) {
            return $query->where('name', 'like', '%'.$search.'%')
                        ->orWhere('no_ref', 'like', '%'.$search.'%');
        });
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Contact::class);
    }

    public function details(): HasMany
    {
        return $this->hasMany(StudentPaymentCategory::class, 's_monthly_payment_details');
    }
}
