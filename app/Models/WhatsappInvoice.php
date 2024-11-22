<?php

namespace App\Models;

use App\Models\User;
use App\Models\Organization;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class WhatsappInvoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'no_ref',
        'product', 
        'description',
        'status',
        'price',
        'organization_id',
        'accepted_by_user_id'
    ];

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function acceptedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'accepted_by_user_id');
    }
    
    public function scopeFilter($query, $filters)
    {
        $query->when($filters['search'] ?? false, function ($query, $search) {
            return $query->where('description', 'like', '%'.$search.'%')
                ->orWhere('no_ref', 'like', '%'.$search.'%')
                ->orWhere('product', 'like', '%'.$search.'%')
                ->orWhereHas('organization', function ($query){
                    return $query->where('name', 'like', '%'.request('search').'%')
                                                ->orWhere('id', 'like', '%'.request('search').'%');
                });
        });

        $query->when($filters['start_date'] ?? false, function ($query, $start_date) {
            return $query->where('created_at', '>=', $start_date);
        });

        $query->when($filters['end_date'] ?? false, function ($query, $end_date) {
            return $query->where('created_at', '<=', $end_date);
        });

        $query->when($filters['status'] ?? false, function ($query, $status) {
            return $query->where('status', $status);
        });

        $query->when($filters['product'] ?? false, function ($query, $product) {
            return $query->where('product', $product);
        });
    }
}
