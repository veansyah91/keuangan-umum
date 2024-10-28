<?php

namespace App\Models;

use App\Models\Journal;
use Illuminate\Database\Eloquent\Model;
use App\Models\StaffSalaryPaymentDetail;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StaffSalaryPayment extends Model
{
    use HasFactory;

    protected $table = 's_salary_payments';

    protected $fillable = [
        'organization_id',
        'created_by_id',
        'journal_id',
        'no_ref',
        'value',
        'date',
        'study_year',
        'month',
    ];

    public function details(): HasMany
    {
        return $this->hasMany(StaffSalaryPaymentDetail::class, 'payment_id');
    }

    public function journal(): BelongsTo
    {
        return $this->belongsTo(Journal::class);
    }
}
