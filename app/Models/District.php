<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class District extends Model
{
    use HasFactory;

    const UPDATED_AT = null;

    const CREATED_AT = null;

    protected $table = 'districts';

    protected $fillable = ['name', 'id', 'regency_id'];

    public function scopeFilter($query, $filters)
    {
        $query->when($filters['search'] ?? false, function ($query, $search) {
            return $query->where('id', 'like', '%'.$search.'%')
                ->orWhere('name', 'like', '%'.$search.'%');
        });

        $query->when($filters['searchDistrict'] ?? false, function ($query, $searchDistrict) {
            return $query->where('name', 'like', '%'.$searchDistrict.'%');
        });

        $query->when($filters['regency'] ?? false, function ($query, $regency) {
            return $query->where('regency_id', $regency);
        });
    }

    public function regency(): BelongsTo
    {
        return $this->belongsTo(Regency::class);
    }
}
