<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SavingCategory extends Model
{
    protected $fillable = ['name', 'organization_id', 'account_id'];

    public function scopeFilter($query, $filters)
    {
        $query->when($filters['search'] ?? false, function ($query, $search) {
            return $query->where('name', 'like', '%'.$search.'%');
        });
    }
}
