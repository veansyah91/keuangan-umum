<?php

namespace App\Models;

use App\Models\Contact;
use App\Models\Organization;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class WhatsappLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'contact_id',
        'description',
        'status'
    ];

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class);
    }

    public function scopeFilter($query, $filters)
    {
        $query->when($filters['search'] ?? false, function ($query, $search) {
            return $query->where('description', 'like', '%'.$search.'%')
                ->orWhere('no_ref', 'like', '%'.$search.'%');
        });

        $query->when($filters['start_date'] ?? false, function ($query, $start_date) {
            return $query->where('date', '>=', $start_date);
        });

        $query->when($filters['end_date'] ?? false, function ($query, $end_date) {
            return $query->where('date', '<=', $end_date);
        });
    }
}
