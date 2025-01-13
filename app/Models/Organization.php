<?php

namespace App\Models;

use App\Models\Menu;
use App\Traits\UUID;
use App\Models\WhatsappPlugin;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Organization extends Model
{
    use HasFactory;
    use UUID;

    protected $fillable = [
        'name',
        'category',
        'address',
        'legality',
        'expired',
        'status',
        'province',
        'province_id',
        'regency',
        'regency_id',
        'district',
        'district_id',
        'village',
        'village_id',
        'slug',
        'is_profit',
        'affiliation_id'
    ];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class)->withPivot('role', 'is_waiting');
    }

    public function menus(): BelongsToMany
    {
        return $this->belongsToMany(Menu::class, 'organization_menu', 'organization_id', 'menu_id')->withPivot('is_active');
    }

    public function accountCategory(): HasMany
    {
        return $this->hasMany(AccountCategory::class);
    }

    public function account(): HasMany
    {
        return $this->hasMany(Account::class);
    }

    public function organizationInvoice(): HasMany
    {
        return $this->hasMany(OrganizationInvoice::class);
    }

    public function fixedAssetCategory(): HasMany
    {
        return $this->hasMany(FixedAssetCategory::class);
    }

    public function whatsApp(): HasOne
    {
        return $this->hasOne(WhatsappPlugin::class);
    }

    public function scopeFilter($query, $filters)
    {
        $query->when($filters['search'] ?? false, function ($query, $search) {
            return $query->where('name', 'like', '%'.$search.'%');
        });

        $query->when($filters['searchOrganization'] ?? false, function ($query, $search) {
            return $query->where('name', 'like', '%'.$search.'%');
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
    }
}
