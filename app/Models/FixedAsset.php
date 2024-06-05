<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FixedAsset extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'user_id',
        'fixed_asset_category_id',
        'asset',
        'accumulated_depreciation',
        'credit_account',
        'depreciation',
        'lifetime',
        'name',
        'code',
        'residue',
        'value',
        'depreciation_value',
        'depreciation_accumulated',
        'status',
        'date',
        'is_disposed',
        'disposal_date',
        'disposal_ref',
        'disposal_description',
        'disposal_journal_id',
    ];

    public function fixedAssetCategory(): BelongsTo
    {
        return $this->belongsTo(FixedAssetCategory::class);
    }

    public function journal(): BelongsTo
    {
        return $this->belongsTo(Journal::class);
    }

    public function scopeFilter($query, $filters)
    {
        $query->when($filters['search'] ?? false, function ($query, $search) {
            return $query->where('name', 'like', '%'.$search.'%')
                ->orWhere('code', 'like', '%'.$search.'%');
        });

        $query->when($filters['start_date'] ?? false, function ($query, $start_date) {
            return $query->where('date', '>=', $start_date);
        });

        $query->when($filters['end_date'] ?? false, function ($query, $end_date) {
            return $query->where('date', '<=', $end_date);
        });

        $query->when($filters['status'] ?? false, function ($query, $status) {
            return $query->where('status', $status == 'true' ? true : false);
        });
    }
}
