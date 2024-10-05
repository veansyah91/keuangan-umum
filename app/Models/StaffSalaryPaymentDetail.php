<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StaffSalaryPaymentDetail extends Model
{
    use HasFactory;

    protected $table = ['s_salary_payment_details'];

    protected $fillable = [
        'payment_id',
        'contact_id',
        'category_id',
        'value'
    ];
}
