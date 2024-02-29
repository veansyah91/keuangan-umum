<?php

namespace App\Models;

use App\Models\User;
use App\Models\Ledger;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Journal extends Model
{
    use HasFactory;

    protected $fillable = [
        'no_ref',
        'description',
        'date',
        'value',
        'organization_id',
        'user_id',
        'is_direct',
        'is_approved',
        'department_id',
        'project_id',
        'program_id'
    ];

    public function ledgers(): HasMany
    {
        return $this->hasMany(Ledger::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function scopeFilter($query, $filters)
    {
        $query->when($filters['search'] ?? false, function ($query, $search) {
            return $query->where('description', 'like', '%'.$search.'%')
                            ->orWhere('no_ref', 'like', '%'.$search.'%');
        });

        $query->when($filters['start_date']?? false, function ($query, $start_date) {
            return $query->where('date', '>=', $start_date);
        });

        $query->when($filters['end_date']?? false, function ($query, $end_date) {
            return $query->where('date', '<=', $end_date);
        });

        $query->when($filters['is_approved']?? false, function ($query, $is_approved) {
            return $query->where('is_approved', $is_approved == "true" ? true : false);
        });
    }
}
