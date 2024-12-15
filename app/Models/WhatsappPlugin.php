<?php

namespace App\Models;

use App\Models\Organization;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class WhatsappPlugin extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'phone',
        'expired_date',
        'url',
        'appKey',
        'authkey',
        'is_active',
        'connection',
        'last_connection'
    ];
    
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function scopeFilter($query, $filters)
    {
        $query->when($filters['search'] ?? false, function ($query, $search) {
            return $query->where('phone', 'like', '%'.$search.'%')
                    ->orWhereHas('organization', function ($query){
                        return $query->where('name', 'like', '%'.request('search').'%')
                                    ->orWhere('id', 'like', '%'.request('search').'%');
                    });
        });

        $query->when($filters['status'] ?? false, function ($query, $status) {
            $is_active = false;

            if ($status === "true") {
                $is_active = true;
            }
            return $query->where('is_active', $is_active);
        });

        $query->when($filters['connection'] ?? false, function ($query, $connection) {
            $is_active = false;

            if ($connection === "true") {
                $is_active = true;
            }
            return $query->where('connection', $is_active);
        });
    }
}
