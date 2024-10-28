<?php

namespace App\Models;

use App\Models\SalaryCategory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StaffSalaryPaymentDetail extends Model
{
    use HasFactory;

    protected $table = 's_salary_payment_details';

    protected $fillable = [
        'payment_id',
        'contact_id',
        'category_id',
        'value',
        'qty'
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(SalaryCategory::class);
    }
}
