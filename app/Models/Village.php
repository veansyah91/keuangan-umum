<?php

namespace App\Models;

use App\Models\District;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Village extends Model
{
    use HasFactory;

    const UPDATED_AT = null;
    const CREATED_AT = null;
    
    protected $fillable = [
                            'name', 
                            'id', 
                            'district_id'];

    public function district(): BelongsTo
    {
        return $this->belongsTo(District::class);
    }

    public function scopeFilter($query, $filters)
    {
        $query->when($filters['search'] ?? false, function ($query, $search) {
            return $query->where('id', 'like', '%'.$search.'%')
                        ->orWhere('name', 'like', '%'.$search.'%');
        });

        $query->when($filters['village'] ?? false, function ($query, $village) {
            return $query->where('name', 'like', '%'.$village.'%');
        });

        $query->when($filters['district'] ?? false, function ($query, $district) {
            return $query->where('district_id', $district);
        });
    }
}
