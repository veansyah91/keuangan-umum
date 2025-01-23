<?php

namespace App\Models;

use App\Models\Account;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SavingCategory extends Model
{
    protected $fillable = ['name', 'organization_id', 'account_id'];

    public function scopeFilter($query, $filters)
    {
        $query->when($filters['search'] ?? false, function ($query, $search) {
            return $query->where('name', 'like', '%'.$search.'%');
        });
    }

    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }
}
