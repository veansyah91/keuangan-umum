<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Regency extends Model
{
    use HasFactory;

    const UPDATED_AT = null;

    const CREATED_AT = null;

    protected $fillable = ['name', 'id', 'province_id'];

    public function scopeFilter($query, $filters)
    {
        $query->when($filters['search'] ?? false, function ($query, $search) {
            return $query->where('id', 'like', '%'.$search.'%')
                ->orWhere('name', 'like', '%'.$search.'%');
        });

        $query->when($filters['searchRegency'] ?? false, function ($query, $searchRegency) {
            return $query->where('name', 'like', '%'.$searchRegency.'%');
        });

        $query->when($filters['province'] ?? false, function ($query, $province) {
            return $query->where('province_id', $province);
        });
    }

    public function province(): BelongsTo
    {
        return $this->belongsTo(Province::class);
    }

    public function district(): HasMany
    {
        return $this->hasMany(District::class);
    }
}
