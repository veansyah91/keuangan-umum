<?php

namespace App\Models;

use App\Models\Journal;
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
        'study_year',
        'payment_id',
        'journal_id',
        'paid_date',
        'created_by_id'
    ];

    public function receivable(): BelongsTo
    {
        return $this->belongsTo(StudentMonthlyReceivable::class);
    }

    public function journal(): BelongsTo
    {
        return $this->belongsTo(Journal::class);
    }

}
