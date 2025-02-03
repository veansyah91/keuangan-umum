<?php

namespace App\Models;

use App\Models\Account;
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
        'no_ref',
        'cash_account_id'
    ];

    public function scopeFilter($query, $filters)
    {
        $query->when($filters['search'] ?? false, function ($query, $search) {
            return $query->where('no_ref', 'like', '%'.$search.'%')
                            ->orWhereHas('savingBalance', function($query) use ($search){
                                return $query->where('no_ref', 'like', '%'. $search .'%');
                            });
        });
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function savingBalance(): BelongsTo
    {
        return $this->belongsTo(SavingBalance::class);
    }

    public function cashAccount(): BelongsTo
    {
        return $this->belongsTo(Account::class, 'cash_account_id');
    }

    public function journal(): BelongsTo
	{
        return $this->belongsTo(Journal::class);
	}
    
}
