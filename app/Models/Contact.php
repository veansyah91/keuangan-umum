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

    public function ContactCategories(): BelongsToMany
    {
        return $this->belongsToMany(ContactCategory::class, 'contact_contact_category', 'contact_id', 'contact_category_id');
    }
}
