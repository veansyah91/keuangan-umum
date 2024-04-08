<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FixedAssetCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'lifetime',
        'name',
        'status',
        'organization_id'
    ];

    public function scopeFilter($query, $filters)
    {
        $query->when($filters['search'] ?? false, function ($query, $search) {
            return $query->where('name', 'like', '%'.$search.'%');
        });

        $query->when($filters['status'] ?? false, function ($query, $status) {
            return $query->where('status', $status == "true" ? true : false);
        });
    }
}
