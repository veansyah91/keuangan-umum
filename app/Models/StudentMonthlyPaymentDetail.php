<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentMonthlyPaymentDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'payment_id',
        'student_payment_category_id',
        'value',
    ];
}
