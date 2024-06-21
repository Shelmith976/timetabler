import React from "react";
import { MdCancel } from "react-icons/md";

const Modal = ({ show, onClose, content }) => {
	return (
		<>
			{show && (
				<div className="fixed top-0 right-0 w-1/2 h-full overflow-auto bg-primary-black/40 z-50">
					<div className="absolute z-50 flex justify-end top-6 right-4">
						<i
							role="button"
							aria-label="close"
							color="primary"
							onClick={onClose}
							className="hover:text-dark-orange/85 transition ease-in-out duration-300 text-white/50 ">
							<MdCancel size={44} />
						</i>
					</div>
					<div>{content}</div>
				</div>
			)}
		</>
	);
};

export default Modal;
