<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\StudentMonthlyReceivable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StudentMonthlyReceivableLedger extends Model
{
    use HasFactory;

    protected $fillable = [
        'receivable_id',
        'debit',
        'credit',
        'no_ref',
        'description',
        'date',
        'month',
        'year',
        'payment_id'
    ];

    public function receivable(): BelongsTo
    {
        return $this->belongsTo(StudentMonthlyReceivable::class);
    }
}
