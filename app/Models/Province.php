<?php

namespace App\Models;

use App\Models\Regency;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Province extends Model
{
    use HasFactory;

    const UPDATED_AT = null;
    const CREATED_AT = null;
    
    protected $fillable = ['name', 'id'];

    public function scopeFilter($query, $filters)
    {
        $query->when($filters['search'] ?? false, function ($query, $search) {
            return $query->where('id', 'like', '%'.$search.'%')
                        ->orWhere('name', 'like', '%'.$search.'%');
        });

        $query->when($filters['searchProvince'] ?? false, function ($query, $searchProvince) {
            return $query->where('name', 'like', '%'.$searchProvince.'%');
        });
    }

    public function regency(): HasMany
    {
        return $this->hasMany(Regency::class);
    }
}
