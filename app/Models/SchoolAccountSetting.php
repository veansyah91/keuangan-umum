<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SchoolAccountSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'revenue_student_account_id',
        'receivable_student_account_id',
        'prepaid_student_account_id',
        'entry_student_account_id',
        'staff_salary_expense_account_id'
    ];
}