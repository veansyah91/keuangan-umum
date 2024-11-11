<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WhatsappPlugin extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'phone',
        'expired_date',
        'url',
        'appKey',
        'authkey',
        'is_active',
        'connection',
        'last_connection'
    ];
}
