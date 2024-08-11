<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StudentMonthlyReceivable extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'contact_id',
        'value'
    ];

    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class);
    }

    public function scopeFilter($query, $filters)
    {
        $query->when($filters['search'] ?? false, function ($query, $search) {
            return $query->whereHas('contact', function ($query) use ($search){
                return $query->where('name', 'like', '%'.$search.'%')
                            ->orWhereHas('student', function ($query) use ($search){
                                return $query->where('no_ref', 'like', '%'.$search.'%');
                            });
            });
        });
    }
}
