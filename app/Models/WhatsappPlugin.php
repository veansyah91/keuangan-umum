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
            return $query->where('description', 'like', '%'.$search.'%')
                ->orWhere('no_ref', 'like', '%'.$search.'%');
        });
    }
}
