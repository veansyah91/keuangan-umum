<?php

namespace App\Models;

use App\Models\Account;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AccountStaff extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id', 
        'staff_salary_expense'
    ];

    public function staffSalaryExpense(): BelongsTo
    {
        return $this->belongsTo(Account::class, 'staff_salary_expense');
    }
}
