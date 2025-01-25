<?php

namespace App\Models;

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
        'value'
    ];

    public function organization(): BelongsTo
    {
        return $this->belongTo(Organization::class);
    }

    public function savingCategory(): BelongsTo
    {
        return $this->belongTo(SavingCategory::class);
    }
}
