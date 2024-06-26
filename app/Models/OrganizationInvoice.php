<?php

namespace App\Models;

use App\Models\Affiliation;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OrganizationInvoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'no_ref',
        'product',
        'description',
        'status',
        'price',
        'organization_id',
        'accepted_by_user_id',
        'affiliation_id'
    ];

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function acceptedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'accepted_by_user_id');
    }

    public function affiliation(): BelongsTo
    {
        return $this->belongsTo(Affiliation::class);
    }

    public function scopeFilter($query, $filters)
    {
        $query->when($filters['search'] ?? false, function ($query, $search) {
            return $query->where('no_ref', 'like', '%'.$search.'%')
                ->orWhere('product', 'like', '%'.$search.'%');
        });

        $query->when($filters['start_date'] ?? false, function ($query, $start_date) {
            return $query->where('created_at', '>=', $start_date);
        });

        $query->when($filters['end_date'] ?? false, function ($query, $end_date) {
            return $query->where('created_at', '<=', $end_date);
        });

        $query->when($filters['organization_id'] ?? false, function ($query, $organization_id) {
            return $query->where('organization_id', $organization_id);
        });

        $query->when($filters['status'] ?? false, function ($query, $status) {
            return $query->where('status', $status);
        });

        $query->when($filters['product'] ?? false, function ($query, $product) {
            return $query->where('product', $product);
        });
    }
}
