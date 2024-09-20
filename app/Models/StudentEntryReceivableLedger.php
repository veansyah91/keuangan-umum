<?php

namespace App\Models;

use App\Models\StudentEntryPayment;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

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

	public function payment(): BelongsTo
	{
		return $this->belongsTo(StudentEntryPayment::class);
	}
}
