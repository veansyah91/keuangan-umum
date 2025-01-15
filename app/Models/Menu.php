<?php

namespace App\Models;

use App\Models\Organization;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Menu extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'page'];

    public function organizations(): BelongsToMany
    {
        return $this->belongsToMany(Organization::class, 'organization_menu', 'organization_id', 'menu_id')->withPivot('is_active');
    }
}
