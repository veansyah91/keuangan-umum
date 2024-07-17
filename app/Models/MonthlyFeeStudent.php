<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MonthlyFeeStudent extends Model
{
    use HasFactory;

    protected $fillable = ['contact_id', 'value'];
}
