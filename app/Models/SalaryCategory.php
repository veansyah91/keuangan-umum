<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalaryCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'name',
        'value',
        'hour',
        'has_hour',
        'is_active',
        'is_cut',
    ];
    
    public function scopeFilter($query, $filters)
    {
        $query->when($filters['search'] ?? false, function ($query, $search) {
            return $query->where('name', 'like', '%'.$search.'%');
        });
    }
}
