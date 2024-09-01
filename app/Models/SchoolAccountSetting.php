<?php

namespace App\Models;

use App\Models\Account;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SchoolAccountSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'revenue_student',
        'receivable_monthly_student',
        'receivable_entry_student',
        'prepaid_student',
        'entry_student',
        'staff_salary_expense',
        'update_level_auto',
    ];

    public function revenueStudent(): BelongsTo
    {
        return $this->belongsTo(Account::class, 'revenue_student');
    }

    public function receivableMonthlyStudent(): BelongsTo
    {
        return $this->belongsTo(Account::class, 'receivable_monthly_student');
    }

    public function receivableEntryStudent(): BelongsTo
    {
        return $this->belongsTo(Account::class, 'receivable_entry_student');
    }

    public function prepaidStudent(): BelongsTo
    {
        return $this->belongsTo(Account::class, 'prepaid_student');
    }

    public function entryStudent(): BelongsTo
    {
        return $this->belongsTo(Account::class, 'entry_student');
    }

    public function staffSalaryExpense(): BelongsTo
    {
        return $this->belongsTo(Account::class, 'staff_salary_expense');
    }
}
