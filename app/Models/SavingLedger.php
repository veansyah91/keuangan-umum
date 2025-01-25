<?php

namespace App\Models;

use App\Models\Organization;
use App\Models\SavingBalance;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SavingLedger extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'saving_balance_id',
        'journal_id',
        'debit',
        'credit',
        'date',
        'description',
        'no_ref'
    ];

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function savingBalance(): BelongsTo
    {
        return $this->belongTo(SavingBalance::class);
    }
}
