<?php

namespace App\Models;

use App\Models\Journal;
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

	public function receivable(): BelongsTo
	{
		return $this->belongsTo(StudentEntryReceivable::class);
	}

	public function journal(): BelongsTo
	{
			return $this->belongsTo(Journal::class);
	}

	public function scopeFilter($query, $filters)
	{
		$query->when($filters['search'] ?? false, function ($query, $search) {
			return $query->where('no_ref', 'like', '%'.$search.'%')
										->orWhereHas('receivable', function ($query) use ($search){
											return $query->whereHas('contact', function ($query) use ($search){
												$query->where('name', 'like', '%'. $search .'%')
															->orWhereHas('student', function ($query) use ($search){
																$query->where('no_ref', 'like', '%'. $search .'%');
															});
											});
											
			});
		});

		$query->when($filters['start_date'] ?? false, function ($query, $start_date) {
			return $query->where('date', '>=', $start_date);
		});

		$query->when($filters['end_date'] ?? false, function ($query, $end_date) {
			return $query->where('date', '<=', $end_date);
		});

		$query->when($filters['studyYear'] ?? false, function ($query, $studyYear) {
			return $query->where('study_year', $studyYear);
		});
	}
}
