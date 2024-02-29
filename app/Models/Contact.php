<?php

namespace App\Models;

use App\Models\ContactCategory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Contact extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'phone', 'address', 'description', 'organization_id'];

    public function contactCategories(): BelongsToMany
    {
        return $this->belongsToMany(ContactCategory::class, 'contact_contact_category', 'contact_id', 'contact_category_id');
    }

    public function scopeFilter($query, $filters)
    {
        $query->when($filters['search'] ?? false, function ($query, $search) {
            return $query->where('name', 'like', '%'.$search.'%')
                            ->orWhere('address', 'like', '%'.$search.'%')
                            ->orWhereHas('contactCategories', function ($query) use ($search){
                                $query->where('name', 'like', '%'.$search.'%');
                            });
        });
    }
}
