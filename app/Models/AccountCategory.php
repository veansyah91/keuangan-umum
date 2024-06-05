<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AccountCategory extends Model
{
    use HasFactory;

    protected $fillable = ['code', 'name', 'organization_id'];

    public function accounts(): HasMany
    {
        return $this->hasMany(Account::class);
    }

    public function scopeFilter($query, $filters)
    {
        $query->when($filters['search'] ?? false, function ($query, $search) {
            return $query->where('name', 'like', '%'.$search.'%')
                ->orWhere('code', 'like', '%'.$search.'%');
        });

        $query->when($filters['accountCategoryFilter'] ?? false, function ($query, $accountCategoryFilter) {
            return $query->where('name', 'like', '%'.$accountCategoryFilter.'%')
                ->orWhere('code', 'like', '%'.$accountCategoryFilter.'%');
        });
    }
}
