<?php

namespace App\Models;

use App\Models\Contact;
use App\Models\Organization;
use App\Models\SavingCategory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SavingBalance extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'contact_id',
        'saving_category_id',
        'value',
        'no_ref'
    ];

    public function scopeFilter($query, $filters)
    {
        $query->when($filters['search'] ?? false, function ($query, $search) {
            return $query->where('no_ref', 'like', '%'.$search.'%');
        });
    }

    public function savingCategory(): BelongsTo
    {
        return $this->belongsTo(SavingCategory::class, 'saving_category_id');
    }

    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class);
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }    

    
}
