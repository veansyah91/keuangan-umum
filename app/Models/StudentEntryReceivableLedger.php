<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentEntryReceivableLedger extends Model
{
	use HasFactory;

	protected $fillable = [
		'receivable_id',
		'created_by_id',
		'payment_id',
		'journal_id',
		'debit',
		'credit',
		'no_ref',
		'description',
		'date',
		'study_year',
		'paid_date'
	];
}
