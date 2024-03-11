<?php

namespace App\Models;

use App\Models\Ledger;
use App\Models\Account;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Account extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'account_category_id',
        'name',
        'code',
        'is_active',
        'is_cash',
        'can_be_deleted'
    ];

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function accountCategory(): BelongsTo
    {
        return $this->belongsTo(AccountCategory::class);
    }
    
    public function cashflows(): HasMany
    {
        return $this->hasMany(Cashflow::class);
    }

    public function ledgers(): HasMany
    {
        return $this->hasMany(Ledger::class);
    }


    public function scopeFilter($query, $filters)
    {
        $query->when($filters['search'] ?? false, function ($query, $search) {
            return $query->where('name', 'like', '%'.$search.'%')
                            ->orWhere('code', 'like', '%'.$search.'%');
        });
    }
}
