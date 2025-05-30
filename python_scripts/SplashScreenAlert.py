import tkinter as tk
from tkinter import font, Canvas

def create_fullscreen_window(alert,setoation,icon):
    root = tk.Tk()
    
    # Set window title
    root.title(setoation)
    
    # Set window icon (ensure you have an .ico file for this)
    try:
        root.iconbitmap(icon)
    except Exception as e:
        print(f"Failed to set icon: {e}")
    
    # Set window to fullscreen and on top
    root.attributes('-fullscreen', True)
    root.attributes('-topmost', True)
    root.configure(bg='#ff1d1d')
    
    # Create a custom font
    custom_font = font.Font(family="Helvetica", size=24, weight="bold")
    
    # Create a Canvas for rounded corners
    canvas = Canvas(root, bg='#ff1d1d', highlightthickness=0)
    canvas.pack(fill=tk.BOTH, expand=True)
    
    # Function to update the canvas with a smaller rounded rectangle
    def update_canvas(event=None):
        canvas.config(width=root.winfo_width(), height=root.winfo_height())
        canvas.delete("rounded_rectangle")
        
        # Rectangle dimensions
        width = root.winfo_width() * 0.8
        height = root.winfo_height() * 0.4
        x0 = (root.winfo_width() - width) / 2
        y0 = (root.winfo_height() - height) / 2
        x1 = x0 + width
        y1 = y0 + height
        
        # Draw a rounded rectangle
        canvas.create_rectangle(
            x0, y0, x1, y1,
            fill='#333333',
            outline='#333333',
            width=2,
            tags="rounded_rectangle"
        )
    
    root.bind("<Configure>", update_canvas)
    
    # Create container frame
    container = tk.Frame(root, bg='#333333', borderwidth=0, relief="flat")
    container.place(relx=0.5, rely=0.5, anchor="center", relwidth=0.8, relheight=0.4)
    
    # Add a label inside the container
    label1 = tk.Label(container, text=f'התראה ב {alert}', font=custom_font, fg='#ffffff', bg='#333333')
    label1.pack(pady=10)
    
    label2 = tk.Label(container, text="שהו במרחב המוכן למשך 10 דקות", font=custom_font, fg='#ffffff', bg='#333333')
    label2.pack(pady=10)

    label3 = tk.Label(container, text=setoation, font=custom_font, fg='#ffffff', bg='#333333')
    label3.pack(pady=10)
    def destroy():
        root.destroy()
    root.after(4000,destroy)
    
    # Function to exit fullscreen
    def exit_fullscreen(event=None):
        root.attributes('-fullscreen', False)
    
    # Bind escape key to exit fullscreen
    root.bind('<Escape>', exit_fullscreen)
    
    # Initial update to draw the rectangle
    update_canvas()
    
    root.mainloop()

if __name__ == "__main__": 
    create_fullscreen_window(alert='חיפה', setoation='ירי טילים ורקטות',icon='')
