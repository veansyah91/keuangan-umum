<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
}
