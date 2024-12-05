<?php

namespace App\Models;

use App\Models\StudentMonthlyPayment;
use App\Models\StudentPaymentCategory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StudentMonthlyPaymentDetail extends Model
{
    use HasFactory;

    protected $table = 's_monthly_payment_details';

    protected $fillable = [
        'payment_id',
        'student_payment_category_id',
        'value',
    ];

    public function payment(): BelongsTo
    {
        return $this->belongsTo(StudentMonthlyPayment::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(StudentPaymentCategory::class);
    }
}
