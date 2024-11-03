<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WhatsappInvoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'phone', 
        'expired_date',
        'url',
        'appKey',
        'authKey',
        'is_active'
    ];
}
