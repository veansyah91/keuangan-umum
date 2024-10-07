<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
}
