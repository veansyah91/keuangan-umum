<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentEntryPaymentCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'name',
        'value',
        'is_active'
    ];
    
    public function scopeFilter($query, $filters)
    {
        $query->when($filters['search'] ?? false, function ($query, $search) {
            return $query->where('name', 'like', '%'.$search.'%');
        });
    }
}
