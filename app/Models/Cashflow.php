<?php

namespace App\Models;

use App\Models\Account;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Cashflow extends Model
{
    use HasFactory;

    protected $fillable = [
        'debit',
        'credit',
        'date',
        'no_ref',
        'contact_id', //jika transaksi melibatkan kontak tertentu
        'account_id',
        'organization_id',
        'journal_id',
        'category'
    ];

    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }
}
