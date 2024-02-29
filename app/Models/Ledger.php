<?php

namespace App\Models;

use App\Models\Account;
use App\Models\Journal;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Ledger extends Model
{
    use HasFactory;

    protected $fillable = [
        'debit',
        'credit',
        'date',
        'destription',
        'no_ref',
        'contact_id', //jika transaksi melibatkan kontak tertentu
        'account_id',
        'organization_id',
        'journal_id'
    ];

    public function journal(): BelongsTo
    {
        return $this->belongsTo(Journal::class);
    }

    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }
}
