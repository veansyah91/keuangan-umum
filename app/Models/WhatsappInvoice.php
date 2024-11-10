<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WhatsappInvoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'no_ref',
        'product', 
        'description',
        'status',
        'price',
        'organization_id',
    ];
}
