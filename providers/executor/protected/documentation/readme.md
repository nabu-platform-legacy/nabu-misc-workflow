Transaction wise we wrap the task publishing in its own transaction, once it is published, it is committed.
This gets rid of the edge case that when we poll afterwards (to see if the workflow is already in that state), we don't have an edge case where the select of the workflow happens right before the state is achieved.

If that edge case happens, the workflow itself will do a correct poll

If you don't pass in a state id, any "final" state will trigger this

if you pass in a definition, you can also pass in the name of a state rather than an id

We made a specific boolean "checkPast" to allow for the workflow to be in a state further then the one you are interested in. This is especially interesting for workflows that depend on each other but never "meet" operationally to guarantee the order.

However the downside is that if you have a workflow that is reprocessed or otherwise has multiple passes past a single state, it will always immediately trigger. This is an exceptional usecase though (especially given the task needs to be published _after_ the reprocess) so by default we do check the past.